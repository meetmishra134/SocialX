import Mailgen from "mailgen";

export interface MailOptions {
  email: string;
  subject: string;
  mailgenContent(): Mailgen.Content;
}
