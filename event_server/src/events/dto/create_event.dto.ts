export class CreateEventDto {
  title: string;
  description?: string;
  condition?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}
