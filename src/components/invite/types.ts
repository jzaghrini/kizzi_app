import dayjs from 'dayjs'

export interface RowInterface {
  fromDate: dayjs.Dayjs
  toDate: dayjs.Dayjs
}

export interface InvitationData {
  userIds: Array<string>
  options: Array<RowInterface>
}
