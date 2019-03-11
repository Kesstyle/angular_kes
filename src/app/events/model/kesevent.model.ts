import { Schedule } from './schedule.model';

export class KesEvent {
    constructor(public id: string, public name: string, public done: boolean, public dateExpire: Date,
        public notificationSchedule: Schedule, public inPast: boolean) {}
}
