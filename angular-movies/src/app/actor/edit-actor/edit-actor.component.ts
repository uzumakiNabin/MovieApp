import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { parseWebApiErrors } from 'src/app/utilities/utils';
import { ActorsService } from '../actors.service';
import { ActorDTO, ActorCreationDTO } from '../actor.model';

@Component({
  selector: 'app-edit-actor',
  templateUrl: './edit-actor.component.html',
  styleUrls: ['./edit-actor.component.sass'],
})
export class EditActorComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private actorsService: ActorsService
  ) {}

  errors: string[] = [];
  model: ActorDTO;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) =>
      this.actorsService
        .getById(param['id'])
        .subscribe((actor) => (this.model = actor))
    );
  }

  editActor(actor: ActorCreationDTO) {
    this.actorsService.edit(this.model.id, actor).subscribe(
      () => {
        this.router.navigate(['/actors']);
      },
      (error) => (this.errors = parseWebApiErrors(error))
    );
  }
}
