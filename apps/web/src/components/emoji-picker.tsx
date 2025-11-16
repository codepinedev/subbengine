import { EmojiPicker as Picker } from 'frimousse'

export function EmojiPicker() {
  return (
    <Picker.Root className="isolate flex h-[368px] w-fit flex-col bg-white dark:bg-neutral-900">
      <Picker.Search className="z-10 mx-2 mt-2 appearance-none rounded-md bg-neutral-100 px-2.5 py-2 text-sm dark:bg-neutral-800" />
      <Picker.Viewport className="relative flex-1 outline-hidden">
        <Picker.Loading className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm dark:text-neutral-500">
          Loading…
        </Picker.Loading>
        <Picker.Empty className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm dark:text-neutral-500">
          No emoji found.
        </Picker.Empty>
        <Picker.List
          className="select-none pb-1.5"
          components={{
            CategoryHeader: ({ category, ...props }) => (
              <div
                className="bg-white px-3 pt-3 pb-1.5 font-medium text-neutral-600 text-xs dark:bg-neutral-900 dark:text-neutral-400"
                {...props}
              >
                {category.label}
              </div>
            ),
            Row: ({ children, ...props }) => (
              <div className="scroll-my-1.5 px-1.5" {...props}>
                {children}
              </div>
            ),
            Emoji: ({ emoji, ...props }) => (
              <button
                className="flex size-8 items-center justify-center rounded-md text-lg data-[active]:bg-neutral-100 dark:data-[active]:bg-neutral-800"
                {...props}
              >
                {emoji.emoji}
              </button>
            ),
          }}
        />
      </Picker.Viewport>
    </Picker.Root>
  )
}
