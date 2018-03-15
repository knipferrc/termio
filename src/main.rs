extern crate cursive;

use cursive::Cursive;
use cursive::theme::{Color, PaletteColor, Theme};
use cursive::views::{Dialog, DummyView, LinearLayout, SelectView, TextView};
use cursive::event::Key;
use cursive::menu::MenuTree;
use cursive::traits::*;
use std::sync::atomic::{AtomicUsize, Ordering};

use std::fs::{self, DirEntry, File};
use std::io::Read;
use std::path::Path;

// This example sets the background color to the terminal default.
//
// This way, it looks more natural.

fn main() {
    let mut app = Cursive::new();

    let theme = custom_theme_from_cursive(&app);
    app.set_theme(theme);

    // We can quit by pressing `q`
    app.add_global_callback('q', Cursive::quit);

    let mut panes = LinearLayout::horizontal();
    let picker = file_picker(".");
    
    panes.add_child(picker.fixed_size((50,50)));
    panes.add_child(DummyView);
    panes.add_child(
        TextView::new("file contents")
            .with_id("contents")
            .fixed_size((50, 25)),
    );
    let mut layout = LinearLayout::vertical();
    layout.add_child(panes);
    layout.add_child(
        TextView::new("status")
            .scrollable(false)
            .with_id("status")
            .fixed_size((80, 1)),
    );
    app.add_fullscreen_layer(Dialog::around(layout).button("Quit", |a| a.quit()));

    let counter = AtomicUsize::new(1);

    // The menubar is a list of (label, menu tree) pairs.
    app.menubar()
        // We add a new "File" tree
        .add_subtree("File",
             MenuTree::new()
                 // Trees are made of leaves, with are directly actionable...
                 .leaf("New", move |s| {
                     // Here we use the counter to add an entry
                     // in the list of "Recent" items.
                     let i = counter.fetch_add(1, Ordering::Relaxed);
                     let filename = format!("New {}", i);
                     s.menubar().find_subtree("File").unwrap()
                                .find_subtree("Recent").unwrap()
                                .insert_leaf(0, filename, |_| ());

                     s.add_layer(Dialog::info("New file!"));
                 })
                 // ... and of sub-trees, which open up when selected.
                 .subtree("Recent",
                          // The `.with()` method can help when running loops
                          // within builder patterns.
                          MenuTree::new().with(|tree| {
                              for i in 1..100 {
                                  // We don't actually do anything here,
                                  // but you could!
                                  tree.add_leaf(format!("Item {}", i), |_| ())
                              }
                          }))
                 // Delimiter are simple lines between items,
                 // and cannot be selected.
                 .delimiter()
                 .with(|tree| {
                     for i in 1..10 {
                         tree.add_leaf(format!("Option {}", i), |_| ());
                     }
                 }))
        .add_subtree("Help",
             MenuTree::new()
                 .subtree("Help",
                          MenuTree::new()
                              .leaf("General", |s| {
                                  s.add_layer(Dialog::info("Help message!"))
                              })
                              .leaf("Online", |s| {
                                  let text = "Google it yourself!\n\
                                              Kids, these days...";
                                  s.add_layer(Dialog::info(text))
                              }))
                 .leaf("About",
                       |s| s.add_layer(Dialog::info("Cursive v0.0.0"))))
        .add_delimiter()
        .add_leaf("Quit", |s| s.quit());

    app.add_global_callback(Key::Esc, |s| s.select_menubar());
    app.run();
}

fn custom_theme_from_cursive(app: &Cursive) -> Theme {
    // We'll return the current theme with a small modification.
    let mut theme = app.current_theme().clone();

    theme.palette[PaletteColor::Background] = Color::TerminalDefault;

    theme
}

fn file_picker<D>(directory: D) -> SelectView<DirEntry>
where
    D: AsRef<Path>,
{
    let mut view = SelectView::new();
    for entry in fs::read_dir(directory).expect("can't read directory") {
        if let Ok(e) = entry {
            let file_name = e.file_name().into_string().unwrap();
            view.add_item(file_name, e);
        }
    }
    view.on_select(update_status).on_submit(load_contents)
}

fn update_status(app: &mut Cursive, entry: &DirEntry) {
    let mut status_bar = app.find_id::<TextView>("status").unwrap();
    let file_name = entry.file_name().into_string().unwrap();
    let file_size = entry.metadata().unwrap().len();
    let content = format!("{}: {} bytes", file_name, file_size);
    status_bar.set_content(content);
}

fn load_contents(app: &mut Cursive, entry: &DirEntry) {
    let mut text_view = app.find_id::<TextView>("contents").unwrap();
    let content = if entry.metadata().unwrap().is_dir() {
        "<DIR>".to_string()
    } else {
        let mut buf = String::new();
        let _ = File::open(entry.file_name())
            .and_then(|mut f| f.read_to_string(&mut buf))
            .map_err(|e| buf = format!("Error: {}", e));
        buf
    };
    text_view.set_content(content);
}
