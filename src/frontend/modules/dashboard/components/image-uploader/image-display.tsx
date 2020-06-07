import * as React from 'react';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { API_HOST, API_IMAGE, API_TODOS } from '../../../util/api-routes';
import "../../scss/image-uploader/image-display.scss";
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import { Backdrop, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import { ImageDeleteConfirm } from '../dialogs/image-delete-confirm';
import { Todo } from '../../../../../backend/entities/todo';

export interface ImageDisplayProps extends WithSnackbarProps {
  images?: string;
  refresh: () => any;
  todoId: number;
}

@observer
class ImageDisplayComponent extends React.Component<ImageDisplayProps> {
  @observable private lightboxImage?: number;
  @observable private deleteConfirm?: number;

  @action private lightbox(id: number): void {
    this.lightboxImage = id;
  }

  private async editTodo(): Promise<void> {
    const todoRequest = await fetch(`${API_HOST}${API_TODOS}/${this.props.todoId}`, {
      method: "GET", 
      headers: {
        Authorization: localStorage.getItem("jwtKey") || ''
      }
    });
    const todoResponseJSON = await todoRequest.json();
    if(todoResponseJSON.failed) {
      this.props.enqueueSnackbar(todoResponseJSON.reason, {
        variant: "error"
      });
      return;
    }
    const todo: Todo = todoResponseJSON.todo;
    const images = todo.images;

    const todoEditRequest = await fetch(`${API_HOST}${API_TODOS}/${this.props.todoId}`, {
      method: "PUT",
      headers: {
        Authorization: localStorage.getItem("jwtKey") || '',
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        dueDate: todo.dueDate,
        task: todo.task,
        images: images?.split(',').map(imageIDStr => Number(imageIDStr)).filter(imageID => imageID !== this.deleteConfirm).join(',')
      })
    });

    const todoEditResponseJSON = await todoEditRequest.json();
    if(todoEditResponseJSON.failed) {
      this.props.enqueueSnackbar(todoEditResponseJSON.reason, {
        variant: "error"
      });
      return;
    }
  }

  @computed private get lightboxRender(): React.ReactNode {
    if(!this.lightboxImage) return null;

    return (
      <Backdrop transitionDuration={200} open className="task-images-lightbox" onClick={() => this.lightboxImage = undefined}>
        <img src={`${API_HOST}${API_IMAGE}/${this.lightboxImage}`} className="lightbox-image" onClick={ev => ev.stopPropagation()} />
        <section className="actions">
          <IconButton onClick={ev => { ev.stopPropagation(); this.deleteConfirm = this.lightboxImage; }}>
            <DeleteIcon className="icon" />
          </IconButton>
          <IconButton>
            <CloseIcon className="icon" />
          </IconButton>
        </section>
      </Backdrop>
    )
  }

  @action private async removeImage(): Promise<void> {
    await this.editTodo();
    const request = await fetch(`${API_HOST}${API_IMAGE}/${this.deleteConfirm}`, {
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

    this.deleteConfirm = undefined;
    this.props.enqueueSnackbar("Image removed.", {
      variant: "default",
      autoHideDuration: 2500
    });
    this.props.refresh();
    this.lightboxImage = undefined;
  }

  public render() {
    if(!this.props.images) return null;

    return (
      <section className="image-display">
        {this.lightboxRender}
        <ImageDeleteConfirm 
          open={Boolean(this.deleteConfirm)}
          close={() => this.deleteConfirm = undefined}
          onClose={() => this.deleteConfirm = undefined}
          confirmDelete={() => this.removeImage()}
        />
        {this.props.images.split(',').map(imageId => Number(imageId)).map(imageId => (
          <div
            className="task-image"
            style={{ backgroundImage: `url(${API_HOST}${API_IMAGE}/${imageId})` }}
            key={imageId}
            onClick={() => this.lightbox(imageId)}
          >
            <IconButton size="small" className="delete-icon" color="primary" onClick={ev => { ev.stopPropagation(); this.deleteConfirm = imageId; }}>
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
      </section>
    )
  }
}

export const ImageDisplay = withSnackbar(ImageDisplayComponent);