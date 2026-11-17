# Rugby, Gamify build

`/rugby/` is built from `JonnyShan/livewire-rugby` (commit c7f4a71). Nothing is pushed back to that repo, and the Livewire site is not changed.

To rebuild:

1. Clone livewire-rugby.
2. Apply `source.patch`. It sets the opponent to Monsoon (dark green), and loosens the camera's sideways follow (followXPos 0.45, followXLook 0.6) so the carrier visibly moves left and right.
3. Copy `brand-gamify/` to `public/brand/gamify/`.
4. Run `VITE_BRAND=gamify npx vite build --outDir <out>`.
5. Delete `<out>/brand/livewire`, then copy `<out>` to `rugby/`.
