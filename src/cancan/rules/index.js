import { allow } from "/cancan/cancan"


class User {}


const viewerIsUser = (viewer, user) => viewer.id === user.id


allow(User, "read password", User, viewerIsUser)
allow(User, "update password", User, viewerIsUser)

allow(User, "read visibility", User, viewerIsUser)
allow(User, "update visibility", User, viewerIsUser)
