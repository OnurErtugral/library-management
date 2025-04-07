export interface CreateUserParams {
  name: string;
}

export interface UserListItem {
  id: number;
  name: string;
}

export interface PastBook {
  name: string;
  userScore: number;
}

export interface PresentBook {
  name: string;
}

export interface UserDetail {
  id: number;
  name: string;
  books: {
    past: PastBook[];
    present: PresentBook[];
  };
}
