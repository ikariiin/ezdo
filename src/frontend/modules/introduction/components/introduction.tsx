import * as React from 'react';
import { Dialog, Stepper, Step, StepButton, StepContent, DialogContent, DialogActions, Button } from '@material-ui/core';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { GetStarted } from './get-started';
import { CreateGroup } from './create-group';
import { CreateTask } from './create-task';
import { ArchiveIntro } from './archive-intro';
import { CompleteIntro } from './complete-intro';
import "../scss/introduction.scss";

export const Steps = [{
  label: "Let's get you started",
  component: <GetStarted />
}, {
  label: "Create a group",
  component: <CreateGroup />
}, {
  label: "Create task",
  component: <CreateTask />
}, {
  label: "Archive",
  component: <ArchiveIntro />
}, {
  label: "That's it!",
  component: <CompleteIntro />
}];

@observer
export class Introduction extends React.Component<{}> {
  @observable alreadyIntroduced: boolean = false;
  @observable activeIndex: number = 0;

  public componentDidMount() {
    this.alreadyIntroduced = localStorage.getItem("user-introduced") == "true";
  }

  private completeIntroduction(): void {
    this.alreadyIntroduced = true;
    localStorage.setItem("user-introduced", true.toString());
  }

  @action private previousStep(): void {
    if(this.activeIndex !== 0) {
      this.activeIndex--;
    }
  }

  @action private nextStep(): void {
    if(this.activeIndex !== Steps.length - 1) {
      this.activeIndex++;
    } else {
      this.completeIntroduction();
    }
  }

  public render() {
    return (
      <Dialog open={!this.alreadyIntroduced} onClose={() => this.completeIntroduction()} fullWidth maxWidth="lg" className="introduction">
        <Stepper nonLinear activeStep={this.activeIndex}>
          {Steps.map((step, index) => (
            <Step key={step.label}>
              <StepButton onClick={() => this.activeIndex = index}>
                {step.label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <DialogContent>
          <section className="component">
            {Steps[this.activeIndex].component}
          </section>
        </DialogContent>
        <DialogActions>
          { this.activeIndex !== Steps.length - 1 && (
            <Button color="primary" variant="text" onClick={() => this.completeIntroduction()}>
              Close
            </Button>
          )}
          <Button color="primary" variant="contained" onClick={() => this.previousStep()} disabled={this.activeIndex === 0}>
            Previous
          </Button>
          <Button color="secondary" variant="contained" onClick={() => this.nextStep()}>
            {
              this.activeIndex === Steps.length - 1 ? "Close" : "Next"
            }
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}