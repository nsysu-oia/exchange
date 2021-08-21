import pdfMake from 'pdfmake/build/pdfmake'

export default async function (questions) {
  const contents = []

  for (const section in questions) {
    for (const identifier in questions[section]) {
      const question = questions[section][identifier]
      contents.push(question.label + ': ' + question.value)
    }
  }

  const docDefinition = {
    content: contents,
    defaultStyle: {
      font: 'timesNewRomanAndKai'
    }
  }

  const fonts = {
    timesNewRomanAndKai: {
      normal: 'https://studyabroad.nsysu.edu.tw/fonts/times-new-roman-and-kai.ttf'
    }
  }

  return pdfMake.createPdf(docDefinition, null, fonts)
}
