export interface DishRes {
  id: number;
  category: {
    id: number,
    name: string
  },
  name: string,
  description: string,
  price: number,
  image: string,
  able: boolean
}