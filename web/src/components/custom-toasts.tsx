import { toast } from 'sonner'
import {
  CircleAlertIcon,
  CircleCheckIcon,
  Info,
  TriangleAlertIcon,
  XIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export const warningToast = (title?: string, description?: string) =>
  toast.custom((t) => (
    // To make the notification fixed, add classes like `fixed bottom-4 right-4` to the container element.
    <div className="z-50 max-w-100 rounded-md border bg-background p-4 shadow-lg">
      <div className="flex gap-2">
        <div className="flex grow gap-3">
          <TriangleAlertIcon
            className="size-5 mt-0.5 shrink-0 text-amber-500"
            aria-hidden="true"
          />
          <div className="flex grow flex-col gap-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {title ?? 'Something requires your action!'}
              </p>
              <p className="text-sm text-muted-foreground">
                {description ??
                  'It conveys that a specific action is needed to resolve or address a situation.'}
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          onClick={() => toast.dismiss(t)}
          aria-label="Close banner"
        >
          <XIcon
            size={16}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  ))

export const errorToast = (title?: string, description?: string) =>
  toast.custom((t) => (
    <div className="z-50 max-w-100 rounded-md border bg-background p-4 shadow-lg">
      <div className="flex gap-2">
        <div className="flex grow gap-3">
          <CircleAlertIcon
            className="size-5 mt-0.5 shrink-0 text-red-500"
            aria-hidden="true"
          />
          <div className="flex grow flex-col gap-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {title ?? "We couldn't complete your request!"}
              </p>
              <p className="text-sm text-muted-foreground">
                {description ??
                  'It indicates that an issue has prevented the processing of the request.'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
            onClick={() => toast.dismiss(t)}
            aria-label="Close notification"
          >
            <XIcon
              size={16}
              className="opacity-60 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
    </div>
  ))

export const successToast = (title?: string, description?: string) =>
  toast.custom((t) => (
    <div className="z-50 max-w-100 rounded-md border bg-background p-4 shadow-lg">
      <div className="flex gap-2">
        <div className="flex grow gap-3">
          <CircleCheckIcon
            className="size-5 mt-0.5 shrink-0 text-emerald-500"
            aria-hidden="true"
          />
          <div className="flex grow flex-col gap-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {title ?? 'Your request was completed!'}
              </p>
              <p className="text-sm text-muted-foreground">
                {description ??
                  'It demonstrates that the task or request has been processed.'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
            onClick={() => toast.dismiss(t)}
            aria-label="Close notification"
          >
            <XIcon
              size={16}
              className="opacity-60 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
    </div>
  ))

export const infoToast = (title?: string, description?: string) =>
  toast.custom((t) => (
    <div className="z-50 max-w-100 rounded-md border bg-background p-4 shadow-lg">
      <div className="flex gap-2">
        <div className="flex grow gap-3">
          <Info
            className="size-5 mt-0.5 shrink-0 text-blue-500"
            aria-hidden="true"
          />
          <div className="flex grow flex-col gap-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {title ?? 'Here is some helpful information!'}
              </p>
              <p className="text-sm text-muted-foreground">
                {description ??
                  'It aims to provide clarity or support for better decision-making.'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
            onClick={() => toast.dismiss(t)}
            aria-label="Close notification"
          >
            <XIcon
              size={16}
              className="opacity-60 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
    </div>
  ))
