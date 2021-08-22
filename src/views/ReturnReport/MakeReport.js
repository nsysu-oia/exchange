import pdfMake from 'pdfmake/build/pdfmake'
const backendHost = process.env.VUE_APP_BACKEND_HOST || 'localhost:8080'

export default async function (questions) {
  const cover = [{
    stack: [
      {
        stack: [
          '國立中山大學',
          '出國交換計畫返國報告書'
        ],
        fontSize: 30,
        margin: [0, 180, 0, 0]
      },
      {
        stack: [
          questions.基本資料.nameChi.value,
          questions.基本資料.studentID.value
        ],
        fontSize: 18,
        margin: [0, 20, 0, 0]
      },
      {
        // regex
        // yyyy-mm-dd to yyyy年m?m月d?d日
        text: questions.基本資料.fillDate.value
          .replace(/-0/g, '-')
          .replace(/-/, '年')
          .replace(/-/, '月')
          .replace(/$/, '日'),
        fontSize: 18,
        margin: [0, 20, 0, 0]
      },
      {
        image: 'logo',
        width: 200,
        margin: [0, 70, 0, 0],
        pageBreak: 'after'
      }
    ],
    alignment: 'center'
  }]

  const table = []
  for (const section in questions) {
    table.push({ text: section, style: 'section' })
    const rows = []
    for (const identifier in questions[section]) {
      const question = questions[section][identifier]
      rows.push([
        { stack: [question.label], style: 'cell' },
        { stack: [question.value], style: 'cell' }
      ])
    }
    table.push({
      layout: 'noBorders',
      table: {
        widths: [200, '*'],
        body: rows
      }
    })
  }

  let content = []
  content = content.concat(cover)
  content = content.concat(table)

  const docDefinition = {
    content: content,
    footer: function (currentPage) {
      return {
        text: (currentPage === 1) ? '' : currentPage.toString(),
        margin: [0, 10, 30, 0],
        fontSize: 10,
        alignment: 'right'
      }
    },
    defaultStyle: {
      font: 'timesNewRomanAndKai'
    },
    images: {
      logo: 'http://' + backendHost + require('@/assets/logos/logo-mobile.png')
    },
    styles: {
      section: {
        fontSize: 20
      },
      cell: {
        margin: 10
      }
    }
  }

  const fonts = {
    timesNewRomanAndKai: {
      normal: 'http://studyabroad.nsysu.edu.tw/fonts/times-new-roman-and-kai.ttf'
    }
  }

  return pdfMake.createPdf(docDefinition, null, fonts)
}
