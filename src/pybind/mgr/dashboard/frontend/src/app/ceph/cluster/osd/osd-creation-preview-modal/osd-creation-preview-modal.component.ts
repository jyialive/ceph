import { Component, EventEmitter, Input, Output } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import _ from 'lodash';

import { OsdService } from '../../../../shared/api/osd.service';
import { ActionLabelsI18n, URLVerbs } from '../../../../shared/constants/app.constants';
import { CdFormBuilder } from '../../../../shared/forms/cd-form-builder';
import { CdFormGroup } from '../../../../shared/forms/cd-form-group';
import { FinishedTask } from '../../../../shared/models/finished-task';
import { TaskWrapperService } from '../../../../shared/services/task-wrapper.service';

@Component({
  selector: 'cd-osd-creation-preview-modal',
  templateUrl: './osd-creation-preview-modal.component.html',
  styleUrls: ['./osd-creation-preview-modal.component.scss']
})
export class OsdCreationPreviewModalComponent {
  @Input()
  driveGroups: Object[] = [];

  @Output()
  submitAction = new EventEmitter();

  action: string;
  formGroup: CdFormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    public actionLabels: ActionLabelsI18n,
    private formBuilder: CdFormBuilder,
    private osdService: OsdService,
    private taskWrapper: TaskWrapperService
  ) {
    this.action = actionLabels.CREATE;
    this.createForm();
  }

  createForm() {
    this.formGroup = this.formBuilder.group({});
  }

  onSubmit() {
    this.taskWrapper
      .wrapTaskAroundCall({
        task: new FinishedTask('osd/' + URLVerbs.CREATE, {
          tracking_id: _.join(_.map(this.driveGroups, 'service_id'), ', ')
        }),
        call: this.osdService.create(this.driveGroups)
      })
      .subscribe({
        error: () => {
          this.formGroup.setErrors({ cdSubmitButton: true });
        },
        complete: () => {
          this.submitAction.emit();
          this.activeModal.close();
        }
      });
  }
}
