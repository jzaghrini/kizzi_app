export interface RowInterface {
  fromDate: Date
  toDate: Date
}

export interface InvitationData {
  userIds: Array<string>
  options: Array<RowInterface>
}
