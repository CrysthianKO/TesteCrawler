export default interface Quote {
  text: string;
  tags: (string | null)[];
  authorId: number;
}
