import * as React from 'react';
import { FrontendImageUpload } from './image-uploader';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import "../../scss/image-uploader/image-embed.scss";
import DeleteIcon from '@material-ui/icons/Delete';
import { CircularProgress } from '@material-ui/core';

export interface ImageEmbedProps extends WithSnackbarProps, FrontendImageUpload {
  removeImage: (id?: number) => any;
}

class ImageEmbedComponent extends React.Component<ImageEmbedProps> {
  private get insideContent(): React.ReactNode {
    if(!this.props.uploadedId) {
      return (
        <section className="spinner">
          <CircularProgress color="primary" />
        </section>
      );
    }

    return (
      <section className="hover-content" onClick={() => this.props.removeImage(this.props.uploadedId)}>
        <DeleteIcon />
        Remove
      </section>
    );
  }

  public render() {
    return (
      <div style={{ backgroundImage: `url(${this.props.objectURL})` }} className={`image-embed`}>
        {this.insideContent}
      </div>
    );
  }
}

export const ImageEmbed = withSnackbar(ImageEmbedComponent);