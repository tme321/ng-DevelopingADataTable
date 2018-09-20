# Developing an Angular Component by Example

The goal of this repo is to document the development process of an Angular component.  Each branch will represent a specific development snapshot that shows the evolution of the component from the initial stages to a version that is suitable for actual use.

The component to be developed will be a datatable.  As development progresses some elements of the datatable will very likely be moved to their own components but the initial design will focus on a single component representing the entire table.

The table will be developed initially with a simple data set of fields with randomly generated values.

The initial version will also immediately set change detection to `onPush` so that features are developed in a way that works with the more performant version of change detection.

This development process will not focus on styling.  A simple set of styles will be used during development to make the table easier to read as development progresses but should not be considered a production ready style.

[Chapter 1. Initial Datatable Design](./chapters/1._Initial_Datatable_Design.md)

[Chapter 2. Testing the Datatable](./chapters/2._Testing_the_Datatable.md)

[Chapter 3. Early Performance Considerations](./chapters/3._Early_Performance_Considerations.md)
