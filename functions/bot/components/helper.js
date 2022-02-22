exports.getUser = (info) => {
  const {
    id,
    is_bot: isBot,
    first_name: firstName,
    last_name: lastName,
  } = info;
  const name = (firstName
    ? firstName
    : '' + ' ' + lastName
    ? lastName
    : ''
  ).trim();
  return { id, isBot, name };
};

exports.getNextDayOfWeek = (date, dayOfWeek) => {
  var resultDate = new Date(date.getTime());

  resultDate.setDate(date.getDate() + ((7 + dayOfWeek - date.getDay()) % 7));

  return resultDate;
};
