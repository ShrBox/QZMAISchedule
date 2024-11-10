async function scheduleTimer({
} = {}) {
  // 复用provider的代码，因为开学时间要从第一周的课表拿
  await loadTool('AIScheduleTools')

  // TODO: 从课表中获取数据而不是硬编码
  let timer = {
    totalWeek: 17, // 总周数：[1, 30]之间的整数
    startSemester: '', // 开学时间：时间戳，13位长度字符串，推荐用代码生成
    startWithSunday: false, // 是否是周日为起始日，该选项为true时，会开启显示周末选项
    showWeekend: true, // 是否显示周末
    forenoon: 4, // 上午课程节数：[1, 10]之间的整数
    afternoon: 4, // 下午课程节数：[0, 10]之间的整数
    night: 4, // 晚间课程节数：[0, 10]之间的整数
    sections: [{
      section: 1, // 节次：[1, 30]之间的整数
      startTime: '08:20', // 开始时间：参照这个标准格式5位长度字符串
      endTime: '09:05', // 结束时间：同上
    }, {
      section: 2,
      startTime: '09:15',
      endTime: '10:00',
    }, {
      section: 3,
      startTime: '10:15',
      endTime: '11:00',
    }, {
      section: 4,
      startTime: '11:10',
      endTime: '11:55',
    }, {
      section: 5,
      startTime: '14:00',
      endTime: '14:45',
    }, {
      section: 6,
      startTime: '14:55',
      endTime: '15:40',
    }, {
      section: 7,
      startTime: '15:55',
      endTime: '16:40',
    }, {
      section: 8,
      startTime: '16:50',
      endTime: '17:35',
    }, {
      section: 9,
      startTime: '18:30',
      endTime: '19:15',
    }, {
      section: 10,
      startTime: '19:25',
      endTime: '20:10',
    }, {
      section: 11,
      startTime: '20:20',
      endTime: '21:05',
    }, {
      section: 12,
      startTime: '21:15',
      endTime: '22:00',
    }],
  }

  // 获取课表节次模式
  const token = sessionStorage.getItem('Token')
  const modeResponse = await fetch(`https://${window.location.hostname}/njwhd/Get_sjkbms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Token': token
    }
  })

  if (modeResponse.status !== 200) {
    await AIScheduleAlert('Timer: 获取节次模式失败，请检查您是否已登录教务系统')
    return timer
  }

  const modeData = await modeResponse.json()
  let modeId = 'null' // 课表节次模式ID
  if (modeData['msg'] === 'success') {
    modeId = modeData['data'][0]['kbjcmsid']
  } else {
    await AIScheduleAlert('Timer: 获取节次模式失败，请检查您是否已登录教务系统')
    return timer
  }

  // 获取当前学期
  const termResponse = await fetch(`https://${window.location.hostname}/njwhd/currentTerm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Token': token
    }
  })

  if (termResponse.status !== 200) {
    await AIScheduleAlert('Timer: 获取学期失败，请检查您是否已登录教务系统')
    return timer
  }

  const termData = await termResponse.json()
  let termId = 'null' // 学期ID
  if (termData['Msg'] === 'success') {
    termId = termData['data'][0]['semesterId']
  } else {
    await AIScheduleAlert('Timer: 获取学期失败，请检查您是否已登录教务系统')
    return timer
  }

  // 获取课表json数据
  const scheduleResponse = await fetch(`https://${window.location.hostname}/njwhd/student/curriculum?xnxq01id=${termId}&kbjcmsid=${modeId}&week=1`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Token': token
    }
  })

  if (scheduleResponse.status !== 200) {
    await AIScheduleAlert('Timer: 获取课表失败，请检查您是否已登录教务系统')
    return timer
  }

  const scheduleData = await scheduleResponse.json()
  if (!scheduleData['Msg'].includes('success')) {
    await AIScheduleAlert('Timer: 获取课表失败，请检查您是否已登录教务系统')
    return timer
  }
  startDate = scheduleData['data'][0]['date'][0]['mxrq']
  timer.startSemester = new Date(startDate).getTime().toString()

  return timer
}
