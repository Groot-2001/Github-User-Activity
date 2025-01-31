import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  convertToDate(createdAt): string {
    const date = new Date(createdAt);
    const day = String(date.getUTCDate()).padStart(2, '0'); // Ensure 2 digits
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getUTCFullYear();

    // Step 3: Format as dd-mm-yyyy
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate
  }
}
