import { allow } from "/cancan/cancan"


class User {}
class IndividualProfile {}


allow(
  User,
  [
    "read password",
    "update password",
    "read visibility",
    "update visibility",
  ],
  User,
  (viewer, user) => viewer.id === user.id
)


allow(
  User,
  [
    "create bank account",
    "update bank account",
    "delete bank account",
  ],
  [
    IndividualProfile
  ],
  (viewer, profile) => viewer.id === profile.user.id
)
