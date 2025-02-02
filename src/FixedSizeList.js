// @flow

import createListComponent from './createListComponent';

import type { Props, ScrollToAlign } from './createListComponent';

const FixedSizeList = createListComponent({
  getItemOffset: ({ itemSize, offset }: Props<any>, index: number): number =>
    index * ((itemSize: any): number) + offset,

  getItemSize: ({ itemSize }: Props<any>, index: number): number =>
    ((itemSize: any): number),

  getEstimatedTotalSize: ({ itemCount, itemSize, offset }: Props<any>) =>
    ((itemSize: any): number) * itemCount + (offset * 2),

  getOffsetForIndexAndAlignment: (
    { direction, height, itemCount, itemSize, layout, width }: Props<any>,
    index: number,
    align: ScrollToAlign,
    scrollOffset: number
  ): number => {
    // TODO Deprecate direction "horizontal"
    const isHorizontal = direction === 'horizontal' || layout === 'horizontal';
    const size = (((isHorizontal ? width : height): any): number);
    const lastItemOffset = align === 'center'
      ? itemCount * itemSize - size
      : Math.max(
        0,
        itemCount * ((itemSize: any): number) - size
      );
    const maxOffset = Math.min(
      lastItemOffset,
      index * ((itemSize: any): number)
    );
    const minOffset = align === 'center'
      ? index * ((itemSize: any): number) - size + ((itemSize: any): number)
      : Math.max(
        0,
        index * ((itemSize: any): number) - size + ((itemSize: any): number)
      );

    if (align === 'smart') {
      if (
        scrollOffset >= minOffset - size &&
        scrollOffset <= maxOffset + size
      ) {
        align = 'auto';
      } else {
        align = 'center';
      }
    }

    switch (align) {
      case 'start':
        return maxOffset;
      case 'end':
        return minOffset;
      case 'center':
        return Math.round(minOffset + (maxOffset - minOffset) / 2);
      case 'auto':
      default:
        if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
          return scrollOffset;
        } else if (scrollOffset < minOffset) {
          return minOffset;
        } else {
          return maxOffset;
        }
    }
  },

  getStartIndexForOffset: (
    { itemCount, itemSize, offset: startOffset }: Props<any>,
    offset: number
  ): number =>
    Math.max(
      0,
      Math.min(itemCount - 1, Math.floor((offset - startOffset) / ((itemSize: any): number)))
  ),

  getStopIndexForStartIndex: (
    { direction, height, itemCount, itemSize, layout, width, offset: startOffset }: Props<any>,
    startIndex: number,
    scrollOffset: number
  ): number => {
    // TODO Deprecate direction "horizontal"
    const isHorizontal = direction === 'horizontal' || layout === 'horizontal';
    const offset = startIndex * ((itemSize: any): number) + startOffset;
    const size = (((isHorizontal ? width : height): any): number);
    const numVisibleItems = Math.ceil(
      (size + scrollOffset - offset) / ((itemSize: any): number)
    );
    return Math.max(
      0,
      Math.min(
        itemCount - 1,
        startIndex + numVisibleItems - 1 // -1 is because stop index is inclusive
      )
    );
  },

  initInstanceProps(props: Props<any>): any {
    // Noop
  },

  shouldResetStyleCacheOnItemSizeChange: true,

  validateProps: ({ itemSize }: Props<any>): void => {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof itemSize !== 'number') {
        throw Error(
          'An invalid "itemSize" prop has been specified. ' +
            'Value should be a number. ' +
            `"${itemSize === null ? 'null' : typeof itemSize}" was specified.`
        );
      }
    }
  },
});

export default FixedSizeList;
