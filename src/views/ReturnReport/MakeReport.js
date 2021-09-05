import pdfMake from 'pdfmake/build/pdfmake'
const backendHost = (process.env.VUE_APP_BACKEND_HOST)
  ? 'https://' + process.env.VUE_APP_BACKEND_HOST
  : 'http://localhost:8080'

function makeCover (subtitle, info) {
  return [{
    stack: [
      {
        text: '國立中山大學出國交換計畫',
        fontSize: 30,
        margin: [0, 100, 0, 0]
      },
      {
        text: '返國報告書' + '（' + subtitle + '）',
        fontSize: 30,
        margin: [0, 40, 0, 0]
      },
      {
        stack: [
          info.countryChi.value + '／' + info.universityChi.value,
          info.collegeChi.value + info.departmentChi.value,
          info.nameChi.value + ' ' + info.studentID.value
        ],
        fontSize: 24,
        margin: [0, 40, 0, 0]
      },
      {
        // regex
        // yyyy-mm-dd to yyyy年m?m月d?d日
        text: info.fillDate.value
          .replace(/-0/g, '-')
          .replace(/-/, '年')
          .replace(/-/, '月')
          .replace(/$/, '日'),
        fontSize: 24,
        margin: [0, 40, 0, 0]
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
}

export function makeFormReport (questions) {
  const cover = makeCover(
    '研修資訊',
    questions.基本資料
  )

  const toc = [{
    toc: {
      id: 'sectionToc',
      title: { text: '目錄', style: 'section' },
      numberStyle: { fontSize: 16 }
    }
  }]

  const table = []
  Object.keys(questions).slice(0, -1).forEach(section => {
    table.push({
      text: section,
      style: 'section',
      tocItem: 'sectionToc',
      tocStyle: { fontSize: 16 },
      pageBreak: 'before'
    })
    const rows = []
    for (const identifier in questions[section]) {
      const question = questions[section][identifier]
      if (question.dependencyValue === undefined ||
        questions[question.dependency[0]][question.dependency[1]].value === question.dependencyValue) {
        rows.push([
          { stack: [question.label], style: 'cell' },
          { stack: [question.value], style: 'cell' }
        ])
      }
    }
    table.push({
      layout: {
        hLineColor: () => {
          return '#E6E6E6'
        },
        vLineWidth: () => {
          return 0
        }
      },
      table: {
        widths: [200, '*'],
        body: rows
      }
    })
  })

  let content = []
  content = content.concat(cover)
  content = content.concat(toc)
  content = content.concat(table)

  const docDefinition = {
    info: {
      title: '國立中山大學出國交換計畫返國報告書',
      author: questions.基本資料.nameChi.value
    },
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
      logo: backendHost + require('@/assets/logos/logo-mobile.png')
    },
    styles: {
      section: {
        fontSize: 20,
        margin: [0, 20]
      },
      cell: {
        margin: 5
      }
    }
  }

  const fonts = {
    timesNewRomanAndKai: {
      normal: 'https://studyabroad.nsysu.edu.tw/fonts/times-new-roman-and-kai.ttf'
    }
  }

  return pdfMake.createPdf(docDefinition, null, fonts)
}

export function makeReviewReport (questions) {
  const cover = makeCover(
    '心得感想',
    questions.基本資料
  )

  const toc = [{
    toc: {
      id: 'sectionToc',
      title: { text: '目錄', style: 'section' },
      numberStyle: { fontSize: 16 }
    }
  }]

  const rows = []
  for (const identifier in questions.心得報告) {
    const question = questions.心得報告[identifier]
    rows.push([
      {
        text: question.label,
        style: 'section',
        tocItem: 'sectionToc',
        tocStyle: { fontSize: 16 },
        pageBreak: 'before'
      },
      { text: question.value }
    ])
  }

  let content = []
  content = content.concat(cover)
  content = content.concat(toc)
  content = content.concat(rows)

  const docDefinition = {
    info: {
      title: '國立中山大學出國交換計畫返國報告書',
      author: questions.基本資料.nameChi.value
    },
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
      logo: backendHost + require('@/assets/logos/logo-mobile.png')
    },
    styles: {
      section: {
        fontSize: 20,
        margin: [0, 20]
      }
    }
  }

  const fonts = {
    timesNewRomanAndKai: {
      normal: 'https://studyabroad.nsysu.edu.tw/fonts/times-new-roman-and-kai.ttf'
    }
  }

  return pdfMake.createPdf(docDefinition, null, fonts)
}
