import * as React from 'react';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import { observable, action } from 'mobx';
import Dropzone, { DropzoneState } from 'react-dropzone';
import { Typography, Paper } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import "../../scss/image-uploader/image-uploader.scss";
import { ImageEmbed } from './image-embed';
import { observer } from 'mobx-react';
import { API_HOST, API_IMAGE } from '../../../util/api-routes';

export interface ImageUploaderProps extends WithSnackbarProps {
  attachImage: (id: number) => any;
  removeImage: (id: number) => any;
  changeUploadProgress: (progress: boolean) => any;
  images?: Array<number>;
  editMode?: boolean;
}

export interface FrontendImageUpload {
  objectURL: string;
  file: File;
  uploadedId?: number;
}

@observer
class ImageUploaderComponent extends React.Component<ImageUploaderProps> {
  @observable private images: Array<FrontendImageUpload> = [];

  @action private async addFiles(files: Array<File>): Promise<void> {
    this.images.push(...files.map(file => {
      const objectURL = URL.createObjectURL(file);

      return {
        file,
        objectURL
      };
    }));

    // Upload the files to the server
    const fileUploadRequest = await Promise.all(files.map(async (file) => {
      const formData = new FormData();
      formData.append("image", file);

      const request = fetch(`${API_HOST}${API_IMAGE}/create`, {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem('jwtKey') || ''
        },
        body: formData
      });

      return {
        file,
        response: await (await request).json()
      };
    }));

    this.images = this.images.map(image => {
      const result = fileUploadRequest.find(request => request.file === image.file);

      if(image.uploadedId || !result) return image;

      this.props.attachImage(result.response.id);
      return {
        ...image,
        uploadedId: result.response.id
      };
    })
  }

  @action private async removeImage(id?: number): Promise<void> {
    if(!id) return;

    this.images = this.images.filter(image => image.uploadedId !== id);
    const request = await fetch(`${API_HOST}${API_IMAGE}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("jwtKey") || ''
      }
    });

    const responseJSON = await request.json();
    if(responseJSON.failed) {
      this.props.enqueueSnackbar(responseJSON.reason, {
        variant: "error"
      });
      return;
    }
    this.props.removeImage(id);
    this.props.enqueueSnackbar("Image removed.", {
      variant: "default",
      autoHideDuration: 2500
    });
  }

  @action private initPropImages(): void {
    if(!this.props.images) return;

    this.images.push(...this.props.images.map(imageId => ({
      file: new File([], ""),
      objectURL: `${API_HOST}${API_IMAGE}/${imageId}`,
      uploadedId: imageId
    })));
  }

  public componentDidMount() {
    this.initPropImages();
  }

  public componentWillUpdate(prevProps: ImageUploaderProps) {
    if(prevProps !== this.props) {
      this.initPropImages();
    }
  }

  public render() {
    return (
      <section className="image-uploader">
        {this.images.map((image, index) => (
          <ImageEmbed removeImage={(id?: number) => this.removeImage(id)} {...image} key={index} />
        ))}
        <Dropzone onDrop={files => this.addFiles(files)} accept="image/*">
          {({ getRootProps, getInputProps }: DropzoneState) => (
            <Paper {...getRootProps()} className="image-upload-dropzone" elevation={8}>
              <input {...getInputProps()} />
              <AddIcon />
              Add Image
            </Paper>
          )}
        </Dropzone>
      </section>
    );
  }
}

export const ImageUploader = withSnackbar(ImageUploaderComponent);