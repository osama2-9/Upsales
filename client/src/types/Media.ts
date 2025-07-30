 interface User {
    name: string;
  }
  
   interface Media {
    mediaId: number;
    title: string;
    director: string;
    duration: string;
    budget: string;
    location: string;
    posterUrl: string | null;
    type: 'Movie' | 'TVshow';
    user: User;
    year: string;
    createdAt: string;
    updatedAt: string;
  }
  
   interface Pagination {
    total: number;
    page: string;
    limit: string;
    totalPages: number;
  }
  
  export type {User,Media,Pagination};