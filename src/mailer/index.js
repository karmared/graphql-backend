import { mailerFetch } from "/transport"


const send = ({ kind, receiver, params }) =>
  mailerFetch({ kind, receiver, params })


export default send
