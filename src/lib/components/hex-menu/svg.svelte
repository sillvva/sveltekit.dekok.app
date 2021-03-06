<script lang="ts">
import { page } from "$app/stores";
import { conClasses } from "$lib/utils";
import type { HexMenuItem } from "$lib/types";

$: pathname = $page.url.pathname;

export let items: (HexMenuItem | null)[] = [];
export let maxLength: number;
export let classes: string[] = [];
export let rotated: boolean;
export let color: string = "var(--color-bg-link)";
export let hoverColor: string = "var(--color-bg-link-hover)";
export let activeColor: string = "var(--color-bg-link-hover)";
export let textColor: string = "var(--color-text-button)";
export let itemClasses: string[] = [];
export let hexagonClasses: string[] = [];
export let labelClasses: string[] = [];

let menuRows: HexMenuItem[][] = [[]];
items.forEach((item, i) => {
  const rowIndex = menuRows.length - 1;
  if (item)
    menuRows[rowIndex].push({
      ...item,
      ...(item.link === pathname && { active: true })
    });
  else menuRows[rowIndex].push({ link: "", label: "" });
  const rotDiff = !rotated && menuRows.length % 2 === 0 ? 1 : 0;
  if (maxLength >= 0 && menuRows[rowIndex].length === maxLength - rotDiff && items.length - 1 > i) {
    menuRows.push([]);
  }
});
</script>

<nav
  class={conClasses(["hex-wrapper", !classes.find(c => c.startsWith("[--scale:")) && "[--scale:1]", ...classes])}
  class:rotated>
  {#each menuRows as row, r}
    <div class="hex-row" class:shift={r % 2 === 1 && !rotated}>
      {#each row as item}
        <div class="hex-menu-item-container" class:rotated>
          <svg
            viewBox="0 0 800 800"
            class={conClasses(["hex-item", ...itemClasses])}
            class:rotated
            class:empty={!item.label}
            class:active={item.active}
            style:--color={color}
            style:--hover-color={hoverColor}
            style:--active-color={activeColor}
            style:--text-color={textColor}
            aria-hidden={!item.label}>
            {#if item.link}
              <a href={item.link} sveltekit:prefetch>
                {#if rotated}
                  <g transform="matrix(-6.92 0 0 -6.92 400.24 400.24)">
                    <polygon
                      class={conClasses(["h-hex", "hex", ...hexagonClasses])}
                      points="-19.9,34.5 -39.8,0 -19.9,-34.5 19.9,-34.5 39.8,0 19.9,34.5 " />
                  </g>
                {:else}
                  <g transform="matrix(0 6.92 -6.92 0 400.17 400.33)">
                    <polygon
                      class={conClasses(["h-hex", "hex", ...hexagonClasses])}
                      points="-19.9,34.5 -39.8,0 -19.9,-34.5 19.9,-34.5 39.8,0 19.9,34.5 " />
                  </g>
                {/if}
                <foreignObject class="hex-fo" x="0" y="0" width="100%" height="100%">
                  <span class={conClasses(["label", ...labelClasses])}>{item.label}</span>
                </foreignObject>
              </a>
            {:else}
              {#if rotated}
                <g transform="matrix(-6.92 0 0 -6.92 400.24 400.24)">
                  <polygon
                    class={conClasses(["h-hex", "hex", ...hexagonClasses])}
                    points="-19.9,34.5 -39.8,0 -19.9,-34.5 19.9,-34.5 39.8,0 19.9,34.5 " />
                </g>
              {:else}
                <g transform="matrix(0 6.92 -6.92 0 400.17 400.33)">
                  <polygon
                    class={conClasses(["h-hex", "hex", ...hexagonClasses])}
                    points="-19.9,34.5 -39.8,0 -19.9,-34.5 19.9,-34.5 39.8,0 19.9,34.5 " />
                </g>
              {/if}
              <foreignObject class="hex-fo" x="0" y="0" width="100%" height="100%">
                <span class={conClasses(["label", ...labelClasses])}>{item.label}</span>
              </foreignObject>
            {/if}
          </svg>
        </div>
      {/each}
    </div>
  {/each}
</nav>

<style lang="scss">
.hex-wrapper {
  display: inline-block;
  .hex-row {
    height: calc(108px * var(--scale));
    position: relative;
    &.shift {
      margin-left: calc(125px / 2 * var(--scale));
    }
  }
  &.rotated {
    .hex-row {
      height: calc(125px * var(--scale));
    }
  }
}

.hex-menu-item-container {
  --baseMargin: -38px;
  display: inline-block;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  width: calc(200px * var(--scale));
  height: calc(200px * var(--scale));
  margin-left: calc(var(--baseMargin) * var(--scale));
  margin-right: calc(var(--baseMargin) * var(--scale));
  z-index: 1;
  pointer-events: none;
  &:hover {
    z-index: 2;
    .hex-menu-item:not(.empty) {
      .hex {
        fill: var(--hover-color);
      }
    }
  }
  &.rotated {
    --baseMargin: -46px;
    &:nth-child(2n) {
      top: calc(50% + 125px / 2 * var(--scale));
    }
  }
  .hex-item {
    width: 100%;
    height: 100%;
    pointer-events: none;
    &.active,
    &.empty {
      cursor: default;
    }
    &.empty {
      .hex {
        fill: transparent;
        pointer-events: none;
      }
    }
    &.active {
      .hex {
        fill: var(--active-color);
      }
    }
    .label {
      font-family: sans-serif;
      white-space: nowrap;
      font-size: 4.5em;
      font-weight: 600;
      text-shadow: 1px 1px 2px var(--text-shadow-color);
      color: var(--text-color);
      letter-spacing: 1px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .hex {
      fill: var(--color);
      z-index: -1;
      backface-visibility: hidden;
      transition: fill 500ms ease, -webkit-transform 1s ease-in-out;
      pointer-events: auto;
      &:hover {
        fill: var(--hover-color);
      }
    }
  }
}

.bounce:hover:not(.active):not(.empty) {
  animation: bounce 500ms ease-in-out forwards;
  stroke: rgb(var(--color-bg-body));
  stroke-width: 0;
  .backface {
    box-shadow: none;
  }
}
@keyframes bounce {
  40% {
    transform: scale(1.1);
    stroke-width: 2;
  }
  60% {
    transform: scale(1);
  }
  80% {
    transform: scale(1.05);
    stroke-width: 2;
  }
  100% {
    transform: scale(1);
  }
}
</style>
