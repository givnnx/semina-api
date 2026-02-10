const createTokenUser = (user: any) => {
  return {
    name: user.name,
    userId: user._id,
    role: user.role,
    email: user.email,
    organizer: user.organizer,
  };
};

const createTokenParticipant = (participant: any) => {
  return {
    lastName: participant.lastName,
    participantId: participant._id,
    firstName: participant.firstName,
    email: participant.email,
  };
};

export { createTokenUser, createTokenParticipant };

