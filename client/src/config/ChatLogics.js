export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 70;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

//messages is all messages, m is current message
// "i" is index of current message, userId is LoggedUser
export const isSameSender = (messages, m, i, userId) => {
  //The first condition checks that it the index doesnt exceed the array length of messages
  // And the next condn has OR operators where
      // 1st checks whether next message is not equal to current sender
      //2nd checks whether next message is undefined or not
      //3rd checks whether current sender is not the LoggedUser
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};


////messages is all messages
// "i" is index of current message, userId is LoggedUser
export const isLastMessage = (messages, i, userId) => {

  //First condn checks whether this is the last message or not
  //Next checks if Id of last sent messg is not LoggedUser
  //Last Checks whether messg actually exists
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

//If users array has logged in user name then skip it and display other users name
export const getSender = (loggedUser, users) => {  
 const otherUser = users.find((user) => user._id !== loggedUser?._id);

  if (otherUser) {
    const fullName = `${otherUser.firstName} ${otherUser.lastName}`;
    return fullName;
  }

  // Return a fallback value if there is no other user
  return "Unknown User";
};