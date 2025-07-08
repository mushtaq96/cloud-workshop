import type { Route } from "./+types/home";
import { TodoList } from "~/components/TodoList";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Todo Application" },
    { name: "description", content: "Welcome to the Todo Application!" },
  ];
}

export default function Home() {
  return <TodoList />;
}
