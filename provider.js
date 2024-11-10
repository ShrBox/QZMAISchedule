async function scheduleHtmlProvider() {
  await loadTool('AIScheduleTools')

  // 获取课表节次模式
  const token = sessionStorage.getItem('Token')
  const modeResponse = await fetch(`https://${window.location.hostname}/njwhd/Get_sjkbms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Token': token
    }
  });

  if (modeResponse.status !== 200) {
    await AIScheduleAlert('Provider: 获取节次模式失败，请检查您是否已登录教务系统')
    return 'do not continue'
  }

  const modeData = await modeResponse.json();
  let modeId = 'null' // 课表节次模式ID
  if (modeData['msg'] === 'success') {
    modeId = modeData['data'][0]['kbjcmsid']
  } else {
    await AIScheduleAlert('Provider: 获取节次模式失败，请检查您是否已登录教务系统')
    return 'do not continue'
  }

  // 获取当前学期
  const termResponse = await fetch(`https://${window.location.hostname}/njwhd/currentTerm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Token': token
    }
  });

  if (termResponse.status !== 200) {
    await AIScheduleAlert('Provider: 获取学期失败，请检查您是否已登录教务系统')
    return 'do not continue'
  }

  const termData = await termResponse.json();
  let termId = 'null' // 学期ID
  if (termData['Msg'] === 'success') {
    termId = termData['data'][0]['semesterId']
  } else {
    await AIScheduleAlert('Provider: 获取学期失败，请检查您是否已登录教务系统')
    return 'do not continue'
  }

  // 获取课表json数据
  const scheduleResponse = await fetch(`https://${window.location.hostname}/njwhd/student/curriculum?xnxq01id=${termId}&kbjcmsid=${modeId}&week=all`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Token': token
    }
  });

  if (scheduleResponse.status !== 200) {
    await AIScheduleAlert('Provider: 获取课表失败，请检查您是否已登录教务系统')
    return 'do not continue'
  }

  const scheduleData = await scheduleResponse.json();
  if (scheduleData['Msg'].includes('success')) {
    return JSON.stringify(scheduleData)
  } else {
    await AIScheduleAlert('Provider: 获取课表失败，请检查您是否已登录教务系统')
  }
  return 'do not continue'
}
