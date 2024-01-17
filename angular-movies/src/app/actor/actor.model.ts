export interface ActorCreationDTO {
  name: string;
  biography: string;
  dateOfBirth: Date;
  photo?: File;
}

export interface ActorDTO {
  id: number;
  name: string;
  biography: string;
  dateOfBirth: Date;
  photo: string;
}

export interface ActorMovieDTO {
  id: number;
  name: string;
  character: string;
  photo: string;
}
