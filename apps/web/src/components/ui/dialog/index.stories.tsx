import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import preview from "#.storybook/preview";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from ".";

const meta = preview.meta({
  component: Dialog,
  title: "UI/Dialog",
});

export const Default = meta.story({
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open dialog</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button variant="destructive">Delete account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
});

export const DefaultOpen = meta.story({
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger render={<Button variant="outline">Open dialog</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
});

export const WithForm = meta.story({
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Edit profile</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update your name and username. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" defaultValue="Yuki Yamamura" />
        </Field>
        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input id="username" defaultValue="@yuki" />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
});

export const FooterWithCloseButton = meta.story({
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Show details</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order #38421</DialogTitle>
          <DialogDescription>Your order is on its way and will arrive by Friday.</DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  ),
});

export const WithoutCloseButton = meta.story({
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open dialog</Button>} />
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Confirm action</DialogTitle>
          <DialogDescription>
            You must choose one of the options below to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
});

export const LongContent = meta.story({
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Read terms</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terms of service</DialogTitle>
          <DialogDescription>
            Please review the terms of service before continuing.
          </DialogDescription>
        </DialogHeader>
        <p style={{ fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur lobortis, libero in
          venenatis tincidunt, libero leo cursus enim, nec consequat dui justo eget nibh. Etiam
          dictum, justo ut tincidunt rhoncus, dolor risus aliquam est, in lobortis libero arcu sed
          erat. Praesent placerat, mi at faucibus pellentesque, lectus arcu mattis dolor, vitae
          dictum metus turpis vitae ipsum.
        </p>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Decline</Button>} />
          <Button>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
});
