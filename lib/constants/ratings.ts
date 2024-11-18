export type Valence = "positive" | "negative" | "numeric"

export const ratingButtons: Record<
  Valence,
  { numericValue: number; src: string; title: string }[]
> = {
  positive: [
    {
      numericValue: 1,
      src: "https://static.quantimo.do/img/rating/face_rating_button_256_depressed.png",
      title: "1/5",
    },
    {
      numericValue: 2,
      src: "https://static.quantimo.do/img/rating/face_rating_button_256_sad.png",
      title: "2/5",
    },
    {
      numericValue: 3,
      src: "https://static.quantimo.do/img/rating/face_rating_button_256_ok.png",
      title: "3/5",
    },
    {
      numericValue: 4,
      src: "https://static.quantimo.do/img/rating/face_rating_button_256_happy.png",
      title: "4/5",
    },
    {
      numericValue: 5,
      src: "https://static.quantimo.do/img/rating/face_rating_button_256_ecstatic.png",
      title: "5/5",
    },
  ],
  negative: [
    {
      numericValue: 1,
      src: "https://static.quantimo.do/img/rating/face_rating_button_256_ecstatic.png",
      title: "1/5",
    },
    {
      numericValue: 2,
      src: "https://static.quantimo.do/img/rating/face_rating_button_256_happy.png",
      title: "2/5",
    },
    {
      numericValue: 3,
      src: "https://static.quantimo.do/img/rating/face_rating_button_256_ok.png",
      title: "3/5",
    },
    {
      numericValue: 4,
      src: "https://static.quantimo.do/img/rating/face_rating_button_256_sad.png",
      title: "4/5",
    },
    {
      numericValue: 5,
      src: "https://static.quantimo.do/img/rating/face_rating_button_256_depressed.png",
      title: "5/5",
    },
  ],
  numeric: [
    {
      numericValue: 1,
      src: "https://static.quantimo.do/img/rating/numeric_rating_button_256_1.png",
      title: "1/5",
    },
    {
      numericValue: 2,
      src: "https://static.quantimo.do/img/rating/numeric_rating_button_256_2.png",
      title: "2/5",
    },
    {
      numericValue: 3,
      src: "https://static.quantimo.do/img/rating/numeric_rating_button_256_3.png",
      title: "3/5",
    },
    {
      numericValue: 4,
      src: "https://static.quantimo.do/img/rating/numeric_rating_button_256_4.png",
      title: "4/5",
    },
    {
      numericValue: 5,
      src: "https://static.quantimo.do/img/rating/numeric_rating_button_256_5.png",
      title: "5/5",
    },
  ],
} 