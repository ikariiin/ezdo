import * as React from 'react';
import { render } from 'react-dom';
import { AppBase } from './modules/root/components/app-base';

render(<AppBase />, document.querySelector('[data-mount]'));