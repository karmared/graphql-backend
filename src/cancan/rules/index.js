import { allow } from "/cancan/cancan"


class User {}


allow(User, "update password", User, (viewer, user) => viewer.id === user.id)

allow(User, "read visibility", User, (viewer, user) => viewer.id === user.id)
allow(User, "update visibility", User, (viewer, user) => viewer.id === user.id)
