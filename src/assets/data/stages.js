const stages = [
  {
    id: '校內甄選階段',
    style: {
      color: '#f2f2f2',
      'background-color': '#464d77'
    },
    notes: [],
    applies: [
      {
        id: 0,
        title: '出國交換甄選申請入口',
        done: true
      },
      {
        id: 1,
        title: '出國獎學金申請入口 (申請對象：自費研修、假日學校及符合教育部學海惜珠資格者)',
        done: false
      }
    ],
    uploads: [],
    downloads: []
  },
  {
    id: '校外提名申請階段',
    style: {
      'background-color': '#98c1d9'
    },
    notes: [
      {
        id: 0,
        title: '國際處將錄取名單提名至姊妹校。'
      },
      {
        id: 1,
        title: '通過姊妹校審核者將會收到入學許可。'
      }
    ],
    applies: [],
    uploads: [
      {
        id: 0,
        title: '入學許可上傳'
      }
    ],
    downloads: [
      {
        id: 0,
        title: '家長同意書擔保書及研修獎助切結書'
      },
      {
        id: 1,
        title: '棄權聲明書(期限外)'
      }
    ]
  },
  {
    id: '出國前一個月',
    style: {
      'background-color': '#aaabd3'
    },
    notes: [
      {
        id: 0,
        title: '出國前請完成出境申請，如是役男身分或有抵免學分需求務必提前申請。'
      },
      {
        id: 1,
        title: '所有資料上傳後，國際處將進行獎助撥款。'
      }
    ],
    applies: [
      {
        id: 0,
        title: '登記出國/返國日期(隨時可更改)',
        done: false
      }
    ],
    uploads: [
      {
        id: 0,
        title: '簽證'
      },
      {
        id: 1,
        title: '護照'
      },
      {
        id: 2,
        title: '存摺封面'
      },
      {
        id: 3,
        title: '電子機票(隨時可更改)'
      }
    ],
    downloads: [
      {
        id: 0,
        title: '役男出境申請表'
      },
      {
        id: 1,
        title: '出境申請表'
      },
      {
        id: 2,
        title: '學生出國預備選修課程表'
      },
      {
        id: 3,
        title: '行前說明會簡報檔'
      }
    ]
  },
  {
    id: '出國期間',
    style: {
      'background-color': '#eebfcd'
    },
    notes: [
      {
        id: 0,
        title: '出國期間定期安全回報，並與家人保持聯繫。'
      },
      {
        id: 1,
        title: '請妥善保管出返國登機證，以供查核。'
      }
    ],
    applies: [
      {
        id: 0,
        title: '安全回報',
        done: false
      },
      {
        id: 1,
        title: '國外選課表',
        done: false
      },
      {
        id: 2,
        title: '期中報告(出國一學年者，於第一學期結束繳交)',
        done: false
      }
    ],
    uploads: [
      {
        id: 0,
        title: '出國登機證(兩週內)'
      }
    ],
    downloads: []
  },
  {
    id: '返國後兩個月',
    style: {
      'background-color': '#ecb8a5'
    },
    notes: [
      {
        id: 0,
        title: '回國後仍須完成返校手續、返國報告書及各項文件上傳。'
      }
    ],
    applies: [
      {
        id: 0,
        title: '返國報告書',
        done: false
      },
      {
        id: 1,
        title: '交換證明書申請表(有需要者可填寫)',
        done: false
      }
    ],
    uploads: [
      {
        id: 0,
        title: '返國登機證(兩週內)'
      },
      {
        id: 1,
        title: '交換成績單(每學期應至少通過兩門課程)'
      }
    ],
    downloads: [
      {
        id: 0,
        title: '抵免申請單'
      },
      {
        id: 1,
        title: '返校手續單'
      }
    ]
  }
]
export default stages
export function getStage (id) {
  return stages.find(item => item.id === id)
}