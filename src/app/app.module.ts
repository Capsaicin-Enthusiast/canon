import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { PostCreateComponent } from './post/post-create/post-create.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [
        PostCreateComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule
    ],
    providers: []
})
export class AppModule { }