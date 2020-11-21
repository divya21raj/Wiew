export class MediaSource {
  public constructor(private readonly sourceName: string, public readonly icon: any, public readonly controller: any) {}

  toString() {
    return this.sourceName;
  }
}
