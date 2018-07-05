import { allow } from "/cancan/cancan"


class User {}


allow(User, "update password", User, (viewer, user) => viewer.id === user.id)
