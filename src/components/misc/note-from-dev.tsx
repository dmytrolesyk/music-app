import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function NoteFromDev() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Here is a note from the developer, please click me!</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Hi guys! </DialogTitle>
          <DialogDescription>
            <p>
              I know this does not look perfect and there's a whole list of things I wish I could do
              if I had some more time
            </p>
            <p>
              I am aware of the imperfections of this codebase.
              <p>
                Audio player has no controls (I just thought that I'd be cool to have soundcloud
                style player and later realized that controls are needed for test... but it was too
                late to add them)
              </p>
              <p>I did not have time to add bulk deletes (although it'd be pretty easy)</p>
              <p>
                AND YEAH, FREAKING SKELETON on page change and search, oh I know it's ugly, I wish I
                had time to fix it
              </p>
              <br />
              <p>But hey, check out how its all managed with query params, I think is pretty rad</p>
            </p>
            <p>
              I just wanted you to know that I did my best with the time I had and, actually, I had
              a blast implementing this app
            </p>
            <p>I learned some new things (tanstack form rules, yo)</p>
            <p>
              <strong>
                And I would be so freakig grateful if you gave me a chance to enroll in your course
              </strong>
            </p>
            <p>Anyway, have a great day!!!</p>

            <br />

            <img width={300} height={300} src="/public/polite-cat.jpg" />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
