import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  capabilityForm: FormGroup;
  recipeForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    // this.loadSkillData('/assets/data.json');
    this.loadRecipeFromSingleFile('/assets/recipeSingle.json');
  }

  private formToRecipe(recipeForm: FormGroup) {}

  private recipeToForm(recipe) {
    return this.fb.group({
      title: recipe.title,
      difficulty: recipe.difficulty,
      serving: recipe.serving,
      cookingTime: recipe.cookingTime,
      preparation: recipe.preparation,
      ingredients: this.fb.array(
        recipe.ingredients.map((i) => this.fb.group({ name: i.name }))
      ),
      categories: this.fb.array(
        recipe.categories.map((c) => this.fb.group({ name: c.name }))
      ),
    });
  }

  private loadRecipeFromSingleFile(path: string) {
    this.http.get(path).subscribe((data: any) => {
      this.recipeForm = this.recipeToForm(data);
      console.log('data');
      console.log(data);
      console.log('this.recipeForm');
      console.log(this.recipeForm);
    });
  }

  private loadRecipeFromListFile(path: string, id: number) {
    this.http.get(path).subscribe((data: any[]) => {
      this.recipeForm = this.recipeToForm(data[id]);
      console.log('data[id]');
      console.log(data[id]);
      console.log('this.recipeForm');
      console.log(this.recipeForm);
    });
  }

  private loadSkillData(path: string) {
    this.http.get(path).subscribe((data: any[]) => {
      this.capabilityForm = this.fb.group({
        capabilities: this.fb.array(
          data.map((datum) => this.generateDatumFormGroup(datum))
        ),
      });
    });
  }

  private generateDatumFormGroup(datum) {
    return this.fb.group({
      capability: this.fb.control({ value: datum.Capability, disabled: true }),
      subCategory: this.fb.control({
        value: datum.SubCategory,
        disabled: true,
      }),
      skill: this.fb.control({ value: datum.Skill, disabled: true }),
      skillId: this.fb.control({ value: datum.SkillID, disabled: true }),
    });
  }

  enableSection(index, disabled) {
    const capabilityFormGroup = (<FormArray>(
      this.capabilityForm.get('capabilities')
    )).at(index);
    disabled ? capabilityFormGroup.enable() : capabilityFormGroup.disable();
  }
}
