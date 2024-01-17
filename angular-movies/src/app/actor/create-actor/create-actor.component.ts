import { Component } from '@angular/core';
import { ActorCreationDTO } from '../actor.model';
import { Router } from '@angular/router';
import { ActorsService } from '../actors.service';
import { parseWebApiErrors } from 'src/app/utilities/utils';

@Component({
  selector: 'app-create-actor',
  templateUrl: './create-actor.component.html',
  styleUrls: ['./create-actor.component.sass'],
})
export class CreateActorComponent {
  constructor(private router: Router, private actorService: ActorsService) {}

  errors: string[] = [];

  saveActor(actor: ActorCreationDTO) {
    this.actorService.create(actor).subscribe(
      () => {
        this.router.navigate(['/actors']);
      },
      (error) => (this.errors = parseWebApiErrors(error))
    );
  }
}
