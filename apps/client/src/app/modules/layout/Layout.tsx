import type { FunctionComponent } from 'react';
import { generatePath, Link, Outlet } from 'react-router';

import { RoutePaths } from '../../routes/paths.const';

export const Layout: FunctionComponent = () => {
  return (
    <div>
      <div>
        <ul>
          <li>
            <Link to={generatePath(RoutePaths.HOME)}>Home</Link>
          </li>
          <li>
            <Link to={generatePath(RoutePaths.RESUME)}>CV</Link>
          </li>
        </ul>
      </div>
      <Outlet />
    </div>
  );
};
