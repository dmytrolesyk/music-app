import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient } from '@tanstack/react-query';
import { Toaster } from 'sonner';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster data-testid="toast-container" position="top-right" />
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  );
}

// <p>
// Hi guys! I know this does not look perfect and there's a whole list of things I wish I could
// do if I had some more time
// </p>
// <p>I am aware of the imperfections of this codebase</p>
// <p>
// I just wanted you to know that I did my best with the time I had and, actually, I had a
// blast implementing this app
// </p>
// <p>I learned some new things (tanstack form rules, yo)</p>
// <p>And I would be so freakig grateful if you gave me a chance to enroll in your course</p>
// <p>Anyway, have a great day!!!</p>
