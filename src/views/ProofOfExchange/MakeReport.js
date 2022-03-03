import pdfMake from 'pdfmake/build/pdfmake'
import mobileLogoUrl from '@/assets/logos/logo-mobile.png'
const backendHost = import.meta.env.VITE_BACKEND_HOST
  ? 'https://' + import.meta.env.VITE_BACKEND_HOST
  : 'http://localhost:8080'

function makeCover(info) {
  return [
    {
      stack: [
        {
          text: '國立中山大學出國交換計畫',
          fontSize: 30,
          margin: [0, 100, 0, 0]
        },
        {
          text: '交換證明書',
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
          margin: [0, 90, 0, 0]
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
          margin: [0, 250, 0, 0]
        },
        {
          image: 'logo',
          width: 200,
          margin: [0, 20, 0, 0],
          pageBreak: 'after'
        }
      ],
      alignment: 'center'
    }
  ]
}

export default questions => {
  const cover = makeCover(questions)
  const table = []
  const rows = []
  for (const identifier in questions) {
    const question = questions[identifier]
    rows.push([
      { stack: [question.label], style: 'cell' },
      { stack: [question.value], style: 'cell' }
    ])
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

  let content = []
  content = content.concat(cover)
  content = content.concat(table)

  const docDefinition = {
    info: {
      title: '國立中山大學出國交換計畫證明書',
      author: questions.nameChi.value
    },
    content: content,
    footer: function (currentPage) {
      return {
        text: currentPage === 1 ? '' : currentPage.toString(),
        margin: [0, 10, 30, 0],
        fontSize: 10,
        alignment: 'right'
      }
    },
    defaultStyle: {
      font: 'timesNewRomanAndKai'
    },
    images: {
      logo: backendHost + mobileLogoUrl
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
      normal:
        'https://studyabroad.nsysu.edu.tw/fonts/times-new-roman-and-kai.ttf'
    }
  }

  return pdfMake.createPdf(docDefinition, null, fonts)
}
