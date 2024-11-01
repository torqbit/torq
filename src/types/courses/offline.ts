export interface IOfflineCourseCard {
  banner: string;
  title: string;
  description: string;
  duration: string;
}

export interface IProgramDetails {
  icon: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  courseDetail: IOfflineCourseCard[];
}

export interface IstudentStories {
  name: string;
  previousImage: string;
  transformedImage: string;
  qualification: string;
  placement: string;
  qualificationLocation: string;
  placementLocation: string;
}
