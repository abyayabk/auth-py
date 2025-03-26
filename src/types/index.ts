export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  language: string;
  translations?: Record<string, {
    title: string;
    content: string;
  }>;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface CommonPhrase {
  id: string;
  category: string;
  text: string;
  translations: Record<string, string>;
}