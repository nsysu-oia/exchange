import { jsPDF as JsPDF } from 'jspdf'
import axios from 'axios'
const backendHost = process.env.VUE_APP_BACKEND_HOST || 'localhost'

export default function (questions) {
  // fetch the font file in base64
  axios
    .post('//' + backendHost + ':3000/font', { font: 'edukai-4.0' })
    .then(({ data }) => {
      // Default export is a4 paper, portrait, using millimeters for units
      const report = new JsPDF()

      report.addFileToVFS('edukai-4.0.ttf', data)
      report.addFont('edukai-4.0.ttf', 'edukai-4.0', 'normal')

      report.setFont('edukai-4.0')

      const contentStr = JSON.stringify(questions)
      // const contentArr = report.splitTextToSize(contentStr, 180)
      report.text(contentStr, 15, 20, { maxWidth: 180 })
      report.output('dataurlnewwindow')
    })
}
