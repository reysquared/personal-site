import _ from 'lodash';
import React, { useState } from 'react';
// TODO|kevin it irks me that I apparently need to import React for jsx stuff to
// work even if I'm not referencing it directly. Should verify if that's actually
// the case and see if there's any way to work around it... I feel like it should
// always be assumed for files ending with .jsx which MIGHT be webpack configurable
// TODO|kevin an element that constitutes a collapsible area
// GOAL: SHOULD BE ANIMATABLE!!!!

// TODO|kevin I also want this to be WAI-ARIA compliant ideally!
// TODO|kevin ... do I need the props unwrap, what was that about again
export default function Collapsible({ regionId, startCollapsed = true, ...props }) {
  const [isCollapsed, setCollapsed] = useState(startCollapsed);
  // TODO|kevin do I actually need to do this `...props` thing or is there a cleaner
  // way? does just including `children` as an arg work or does that fuck things
  // up since it's passed differently?
  // TODO|kevin since I'm planning to animate the collapse using height, i.e.
  // the contents will not be display: none when hidden, I think I need to be
  // sure to use the aria-hidden attribute when the panel is collapsed
  // TODO|kevin does this need tabindex?
  // TODO|kevin I feel like this should probably accept SOME kind of configurable
  // real label or header. And then I should prolly add aria-labelledby or s/t
  return (
    <div>
      <button
        className="collapsible-button"
        aria-controls={regionId}
        aria-expanded={!isCollapsed}
        onClick={() => setCollapsed(_.negate(_.identity))}
      >
        {isCollapsed ? 'Expand' : 'Collapse'}
      </button>
      <div
        id={regionId}
        className={`collapsible-panel${isCollapsed ? ' collapsed' : ''}`}
        aria-hidden={isCollapsed}
      >
        {props.children}
      </div>
    </div>
  );
}