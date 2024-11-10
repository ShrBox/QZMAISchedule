function scheduleHtmlParser(json) {
  const courseInfos = []
  const schedule = JSON.parse(json);
  const courses = schedule['data'][0]['item']
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i]
    const weeksStr = course['classWeekDetails'].split(',')
    const filteredWeeksStr = weeksStr.filter(week => week.trim() !== '');
    const weeks = filteredWeeksStr.map(week => parseInt(week, 10));
    const courseTemp = {
      name: course['courseName'],
      teacher: course['teacherName'],
      position: course['location'],
      weeks: weeks,
      day: course['weekNoteDetail'][0],
      sections: course['weekNoteDetail'].split(',').map(section =>
        parseInt(section.slice(-2), 10)
      )
    }
    courseInfos.push(courseTemp)
  }
  return courseInfos
}
